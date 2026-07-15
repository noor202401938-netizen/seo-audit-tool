import os
import html
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

class ReportGenerator:
    @staticmethod
    def clean_for_pdf(text: str) -> str:
        if not text:
            return ""
        # HTML escape to prevent ReportLab parser from treating tags as markup
        escaped = html.escape(str(text))
        # Convert newlines to linebreaks in PDF
        return escaped.replace("\n", "<br/>")

    @staticmethod
    def generate_pdf(
        filename: str,
        website: str,
        onpage_score: int,
        offpage_score: int,
        onpage_issues: list,
        backlink_snapshot: dict
    ):
        """
        Generates a styled PDF SEO report for the website.
        """
        # Ensure directories exist
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        doc = SimpleDocTemplate(filename, pagesize=letter,
                                rightMargin=40, leftMargin=40,
                                topMargin=40, bottomMargin=40)
        story = []
        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontSize=26,
            leading=30,
            textColor=colors.HexColor("#0f172a"), # slate-900
            spaceAfter=15
        )
        
        section_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Heading2'],
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#1e293b"), # slate-800
            spaceBefore=15,
            spaceAfter=10,
            keepWithNext=True
        )
        
        body_style = ParagraphStyle(
            'BodyTextCustom',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#334155") # slate-700
        )
        
        bold_body_style = ParagraphStyle(
            'BoldBodyTextCustom',
            parent=body_style,
            fontName='Helvetica-Bold'
        )

        issue_style = ParagraphStyle(
            'IssueText',
            parent=body_style,
            fontSize=9,
            leading=13
        )

        # Header / Title Block
        story.append(Paragraph("SEO Intelligence Report", title_style))
        story.append(Paragraph(f"<b>Target Website:</b> {html.escape(website)}", body_style))
        story.append(Spacer(1, 15))

        # Scores Summary Table
        score_data = [
            [Paragraph("<b>AUDIT METRIC</b>", bold_body_style), Paragraph("<b>SCORE</b>", bold_body_style), Paragraph("<b>STATUS</b>", bold_body_style)],
            [Paragraph("On-Page SEO Score", body_style), f"{onpage_score} / 100", "Optimal" if onpage_score >= 80 else "Sub-Optimal" if onpage_score >= 50 else "Critical"],
            [Paragraph("Off-Page SEO Score", body_style), f"{offpage_score} / 100", "Optimal" if offpage_score >= 80 else "Sub-Optimal" if offpage_score >= 50 else "Critical"]
        ]
        
        score_table = Table(score_data, colWidths=[200, 150, 150])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#0f172a")),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ]))
        story.append(score_table)
        story.append(Spacer(1, 20))

        # Off-Page Findings
        story.append(Paragraph("Off-Page SEO Findings", section_style))
        if backlink_snapshot:
            offpage_data = [
                [Paragraph("<b>Metric</b>", bold_body_style), Paragraph("<b>Value</b>", bold_body_style)],
                [Paragraph("Domain Authority (DA)", body_style), str(backlink_snapshot.get("domain_authority", 0))],
                [Paragraph("Page Authority (PA)", body_style), str(backlink_snapshot.get("page_authority", 0))],
                [Paragraph("Total Backlinks", body_style), f"{backlink_snapshot.get('total_backlinks', 0):,}"],
                [Paragraph("Referring Domains", body_style), f"{backlink_snapshot.get('referring_domains', 0):,}"],
                [Paragraph("Spam Score", body_style), f"{backlink_snapshot.get('spam_score', 0)}%"]
            ]
            offpage_table = Table(offpage_data, colWidths=[250, 250])
            offpage_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                ('TOPPADDING', (0,0), (-1,-1), 6),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ]))
            story.append(offpage_table)
        else:
            story.append(Paragraph("No Off-Page SEO data found or available.", body_style))
        
        story.append(Spacer(1, 20))

        # On-Page Findings & Recommendations
        story.append(Paragraph("On-Page SEO Issues & Recommendations", section_style))
        
        if onpage_issues:
            issues_data = [
                [Paragraph("<b>Page / URL</b>", bold_body_style), Paragraph("<b>Severity</b>", bold_body_style), Paragraph("<b>Issue</b>", bold_body_style), Paragraph("<b>Fix</b>", bold_body_style)]
            ]
            
            for issue in onpage_issues:
                url_display = issue.get("page_url", "")
                if len(url_display) > 40:
                    url_display = url_display[:37] + "..."
                
                issues_data.append([
                    Paragraph(ReportGenerator.clean_for_pdf(url_display), issue_style),
                    Paragraph(ReportGenerator.clean_for_pdf(issue.get("severity", "Notice")), issue_style),
                    Paragraph(ReportGenerator.clean_for_pdf(issue.get("issue", "")), issue_style),
                    Paragraph(ReportGenerator.clean_for_pdf(issue.get("fixes", "Manual review")), issue_style),
                ])
                
            issues_table = Table(issues_data, colWidths=[120, 60, 160, 160])
            issues_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                ('TOPPADDING', (0,0), (-1,-1), 6),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ]))
            story.append(issues_table)
        else:
            story.append(Paragraph("System Nominal: No On-Page SEO issues detected.", body_style))
            
        doc.build(story)
