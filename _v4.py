# -*- coding: utf-8 -*-
from pathlib import Path

js = Path("script.js").read_text(encoding="utf-8")
block = js[js.find("QUIZ_QUESTIONS"): js.find("const MSG")]
# Extract question order by ids and types
import re
ids = re.findall(r"id:\s*(\d+)", block)
types = re.findall(r"type:\s*'(\w+)'", block)
print("ids", ids)
print("types", types)
print("has_ron", "רון" in block)
print("has_wrongPin", "wrongPin" in js)
print("pin_uses_wrongPin", "MSG.wrongPin" in js)
# Choice wrong should still call MSG.wrong without wrongPin in that branch
# Count showQuizFeedback for wrong
print("submitLabel", "פתחי את המכתב" in block)
Path("_upd_quiz.py").unlink(missing_ok=True)
print("done")
