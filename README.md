# 🎫 HelpDesk System

Система обработки заявок с AI-анализом (FastAPI + React + PostgreSQL)

## 🚀 Быстрый старт

### Требования
- Python 3.12+
- Node.js 18+
- PostgreSQL 14+
- Ollama (для AI, опционально)

---

### Backend

```bash
cd backend

# Создай виртуальное окружение
python -m venv venv
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate  # Windows

# Установи зависимости
pip install -r requirements.txt

# Настрой .env
cp .env.example .env
# Отредактируй .env с своими данными

# Запусти сервер
uvicorn main:app --reload
```

Backend работает на http://localhost:8000

API docs: http://localhost:8000/docs

---

### Frontend

```bash
cd frontend

# Установи зависимости
npm install

# Запусти
npm run dev
```

Frontend работает на http://localhost:5173

---

### База данных

```bash
# Создай БД в PostgreSQL
psql -U postgres -c "CREATE DATABASE helpdesk;"

# Запусти миграцию
psql -U postgres -d helpdesk -f backend/schema.sql
```

Или просто создай таблицы через SQLAlchemy — они создадутся автоматически при первом запуске.

---

## 🔧 Настройка AI

### Вариант 1: Ollama (бесплатно, локально)

```bash
# Установи Ollama
brew install ollama  # Mac
# oder Windows: скачай с ollama.ai

# Запусти Ollama
ollama serve

# Скачай модель
ollama pull llama3.2:1b

# В .env добавь
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama3.2:1b
```

### Вариант 2: OpenAI (платно)

```bash
# В .env добавь ключ
OPENAI_API_KEY=sk-...
```

---

## 📡 API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/tickets` | Список заявок |
| POST | `/tickets` | Создать заявку |
| GET | `/tickets/{id}` | Одна заявка |
| PATCH | `/tickets/{id}/status` | Изменить статус |
| DELETE | `/tickets/{id}` | Удалить заявку |

---

## 🛠 Tech Stack

**Backend:**
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Ollama (AI)

**Frontend:**
- React + Vite
- TypeScript
- TailwindCSS
- Axios
- React Router

---

## 📁 Структура

```
helpdesk/
├── backend/
│   ├── main.py      # FastAPI app
│   ├── db.py      # Подключение к БД
│   ├── models.py   # SQLAlchemy модели
│   ├── schemas.py  # Pydantic схемы
│   ├── crud.py    # Операции с БД
│   ├── ai.py     # AI анализ
│   └── schema.sql # SQL схема
├── frontend/
│   ├── src/
│   │   ├── api/       # API клиент
│   │   ├── components/# Компоненты
│   │   ├── pages/     # Страницы
│   │   └── types/    # TypeScript типы
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🎨 Возможности

- [x] Создание заявок
- [x] Просмотр списка заявок
- [x] Просмотр деталей заявки
- [x] Изменение статуса (open → in_progress → closed)
- [x] Удаление заявок
- [x] AI анализ приоритета
- [x] AI генерация ответа
- [x] Поиск по заявкам
- [x] Фильтры по статусу и приоритету
- [x] Статистика
- [x] Красивый UI

---

## 📝 Лицензия

MIT