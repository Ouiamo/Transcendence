FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY ai_predictor.py .
CMD ["python", "ai_predictor.py"]