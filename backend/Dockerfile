FROM  python:3.10.12

ENV PYTHONUNBUFFERED=1


WORKDIR /backend

COPY req.txt ./

RUN pip install  -r req.txt

COPY manage.py ./

COPY . .

EXPOSE 8000
