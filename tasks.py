import subprocess
import json

def perform_audit_task(url: str, crawl: bool = False, max_pages: int = 10):
    try:
        # Build seomator command
        cmd = ["seomator", "audit", url, "--format", "json", "--no-cwv"]
        
        if crawl:
            cmd.extend(["--crawl", "-m", str(max_pages)])
            
        print(f"Running seomator command: {' '.join(cmd)}")
            
        # Execute seomator CLI
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        # If exit code indicates failure, raise exception with stderr
        if result.returncode != 0:
            raise Exception(f"Seomator error: {result.stderr.strip() or result.stdout.strip()}")
            
        # Parse output JSON
        audit_data = json.loads(result.stdout)
        
        # Add success status expected by our frontend
        audit_data["status"] = "success"
        
        return audit_data
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise e
