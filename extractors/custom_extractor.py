"""
extractors/custom_extractor.py
Uses Google Gemini to extract highly specific data based on a user's custom prompt.
"""

import json
from bs4 import BeautifulSoup
import google.generativeai as genai

import config
from utils.html_parser import make_soup
from utils.logger import get_logger

logger = get_logger("custom_extractor")

# Cache to avoid configuring multiple times
_is_configured = False

def configure_genai():
    global _is_configured
    if not _is_configured and config.GEMINI_API_KEY:
        genai.configure(api_key=config.GEMINI_API_KEY)
        _is_configured = True

def extract_custom_data(html: str, prompt: str, soup: BeautifulSoup = None) -> list:
    """
    Sends the webpage text to Gemini and asks it to extract data matching the prompt.
    Returns a list of extracted strings/objects.
    """
    if not config.GEMINI_API_KEY or not prompt:
        return []

    configure_genai()

    if soup is None:
        soup = make_soup(html)

    # Clean the HTML to just text to save tokens and avoid confusing the LLM
    text_content = soup.get_text(separator="\n", strip=True)
    
    # If the page is completely empty, skip
    if len(text_content) < 50:
        return []

    # Limit text to roughly 30k chars to avoid blowing up context windows on massive pages unnecessarily
    text_content = text_content[:30000]

    system_instruction = (
        "You are a strict data extraction bot. Your job is to extract exactly what the user asks for from the provided webpage text. "
        "Return the results as a JSON list of strings (e.g. [\"item 1\", \"item 2\"]). "
        "If you cannot find the requested information, return an empty list: []"
        "Do NOT include markdown formatting like ```json in your response, just the raw JSON array."
    )

    try:
        model = genai.GenerativeModel('gemini-2.5-flash', system_instruction=system_instruction)
        
        full_prompt = f"User Request: {prompt}\n\nWebpage Text:\n{text_content}"
        
        response = model.generate_content(full_prompt)
        result_text = response.text.strip()
        
        # Clean up any potential markdown formatting the model might still try to output
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
            
        result_text = result_text.strip()
        
        data = json.loads(result_text)
        if isinstance(data, list):
            return data
        elif data:
            return [str(data)]
            
    except Exception as e:
        logger.warning(f"Gemini custom extraction failed: {e}")
        
    return []
