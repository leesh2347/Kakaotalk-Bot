import os
import datetime
import PyPDF2  # 추가

class MCPTools:
    @staticmethod
    def get_current_time():
        return datetime.datetime.now().strftime("%Y-%m-%d")
    
    @staticmethod
    def calculate(expression: str):
        try:
            allowed_chars = set('0123456789+-*/()., ')
            if not all(c in allowed_chars for c in expression):
                return "오류: 허용되지 않는 문자가 포함되어 있습니다."
            result = eval(expression)
            return f"계산 결과: {result}"
        except Exception as e:
            return f"계산 오류: {str(e)}"
    
    @staticmethod
    def get_weather(city: str = "서울"):
        weather_data = {
            "서울": "맑음, 15°C",
            "부산": "흐림, 18°C",
            "대구": "비, 12°C"
        }
        return weather_data.get(city, f"{city}의 날씨 정보를 찾을 수 없습니다.")
    
    @staticmethod
    def search_web(query: str):
        return f"'{query}'에 대한 검색 결과 (시뮬레이션): 관련 정보를 찾았습니다."
    
    @staticmethod
    def file_operations(operation: str, filename: str = "", content: str = ""):
        print("=== file_operations called ===")
        """파일 작업을 수행합니다."""
        try:
            if operation == "list":
                files = os.listdir(".")
                return f"디렉토리 내용: {', '.join(files[:10])}"  # 처음 10개만
            elif operation == "read" and filename:
                abs_path = os.path.abspath(filename)
                print("DEBUG - filename:", filename)
                print("DEBUG - abspath:", abs_path)
                print("DEBUG - exists:", os.path.exists(abs_path))
                if os.path.exists(abs_path) and os.path.getsize(abs_path) < 100 * 1024 * 1024:  # 100MB 미만만
                    with open(abs_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if len(content) > 50000:
                            return f"파일 내용 (처음 50000자):\n{content[:50000]}\n... (이하 생략)"
                        return f"파일 내용:\n{content}"
                else:
                    return f"파일이 존재하지 않거나 너무 큽니다.{abs_path}, {os.path.getsize(abs_path)}"
            elif operation == "write" and filename and content:
                abs_path = os.path.abspath(filename)
                with open(abs_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                return f"파일 '{abs_path}'에 내용을 저장했습니다."
            else:
                return "지원되지 않는 파일 작업입니다."
        except Exception as e:
            return f"파일 작업 오류: {str(e)}"
        
    @staticmethod
    def read_pdf(filepath: str):
        """
        PDF 파일 경로를 받아, 내부의 모든 페이지에서 텍스트를 추출해 반환합니다.
        """
        if not os.path.exists(filepath):
            return f"오류: 파일을 찾을 수 없습니다. ({filepath})"
        try:
            with open(filepath, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = []
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text.append(page_text)
                full_text = "\n".join(text).strip()
                return full_text or "PDF에서 텍스트를 추출할 수 없습니다."
        except Exception as e:
            return f"PDF 읽기 오류: {str(e)}"

MCP_TOOL_MAP = {
    "get_current_time": {
        "function": MCPTools.get_current_time,
        "description": "현재 시간을 가져옵니다",
        "parameters": {}
    },
    "calculate": {
        "function": MCPTools.calculate,
        "description": "수학 계산을 수행합니다",
        "parameters": {
            "expression": {"type": "string", "description": "계산할 수식"}
        }
    },
    "get_weather": {
        "function": MCPTools.get_weather,
        "description": "날씨 정보를 가져옵니다",
        "parameters": {
            "city": {"type": "string", "description": "도시 이름", "default": "서울"}
        }
    },
    "search_web": {
        "function": MCPTools.search_web,
        "description": "웹 검색을 수행합니다",
        "parameters": {
            "query": {"type": "string", "description": "검색할 내용"}
        }
    },
    "file_operations": {
        "function": MCPTools.file_operations,
        "description": "파일 작업을 수행합니다 (list, read, write)",
        "parameters": {
            "operation": {"type": "string", "description": "수행할 작업 (list, read, write)"},
            "filename": {"type": "string", "description": "파일 이름", "default": ""},
            "content": {"type": "string", "description": "파일에 쓸 내용", "default": ""}
        }
    },
    "read_pdf": {
        "function": MCPTools.read_pdf,
        "description": "PDF 파일의 텍스트를 추출합니다",
        "parameters": {
            "filepath": {"type": "string", "description": "읽어올 PDF 파일의 전체 경로"}
        }
    }
}