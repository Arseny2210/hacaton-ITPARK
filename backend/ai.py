import os
import logging
import random
import re
from schemas import AIAnalysisResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RESPONSES = {
    "high": [
        "Мы срочно займёмся вашей проблемой. Наш специалист свяжется с вами в ближайшие 15 минут.",
        "Принято! Это срочный случай. Сейчас передаём вашу заявку дежурному инженеру.",
        "Понял, ситуация критическая. Выделяем приоритет и решаем вопрос в экстренном порядке.",
        "Срочно! Поднимаем вашу заявку вверх очереди. Специалист уже в пути к вам.",
    ],
    "medium": [
        "Спасибо за обращение. В течение часа посмотрим вашу заявку и свяжемся с вами.",
        "Принято. Записали, передадим специалисту. Ожидайте звонка в рабочее время.",
        "Ваша заявка в работе. Мы обработаем её и сообщим результат.",
        "Спасибо! Рассмотрим вашу заявку и пришлём решение.",
    ],
    "low": [
        "Спасибо за обращение. Записали вашу заявку, обработаем в порядке очереди.",
        "Принято. Свяжемся с вами, когда будет готово решение.",
        "Спасибо! Ваша заявка принята. Мы сообщим, когда её рассмотрят.",
        "Хорошо, зафиксировали. Ожидайте информации в ближайшее время.",
    ],
}

KEYWORDS_HIGH = [
    "срочно",
    "сломал",
    "авария",
    "не работае",
    "упал",
    "down",
    "критическ",
    "перестал рабо",
    "неисправен",
]
KEYWORDS_MEDIUM = [
    "медлен",
    "тормоз",
    "завис",
    "глюк",
    "баг",
    "ошибк",
    "не печата",
    "не подключа",
    "забыл",
    "интернет",
    "vpn",
    "настроить",
    "сеть",
]
KEYWORDS_LOW = [
    "нов",
    "хочу",
    "нужен",
    "куп",
    "заказ",
    "доступ",
    "выдать",
    "настроить",
    "установить",
    "подключить",
    "выдать",
]


def _detect_priority(description: str) -> str:
    desc = description.lower()

    if any(w in desc for w in KEYWORDS_HIGH):
        return "high"
    if any(w in desc for w in KEYWORDS_MEDIUM):
        return "medium"
    if any(w in desc for w in KEYWORDS_LOW):
        return "low"

    return "medium"


def _get_response(priority: str) -> str:
    if priority == "high":
        starters = ["Мы срочно", "Принято!", "Ситуация критическая", "Срочно!"]
    elif priority == "medium":
        starters = ["Спасибо", "Принято", "Ваша заявка", "Рассмотрим"]
    else:
        starters = ["Спасибо", "Принято", "Хорошо", "Зафиксировали"]

    base = random.choice(starters)

    if priority == "high":
        endings = [
            "займёмся вашей проблемой. Специалист свяжется в ближайшие 15 минут.",
            "! Это срочный случай. Передаём заявку дежурному инженеру.",
            ". Выделяем приоритет и решаем вопрос в экстренном порядке.",
            "! Поднимаем заявку вверх очереди.",
        ]
    elif priority == "medium":
        endings = [
            "за обращение. В течение часа посмотрим вашу заявку.",
            ". Записали, передадим специалисту.",
            " в работе. Мы обработаем её и сообщим результат.",
            "! Рассмотрим вашу заявку и пришлём решение.",
        ]
    else:
        endings = [
            "за обращение. Записали, обработаем в порядке очереди.",
            ". Свяжемся, когда будет готово решение.",
            "! Ваша заявка принята.",
            ". Ожидайте информации.",
        ]

    return base + random.choice(endings)


def analyze_ticket(description: str) -> tuple[AIAnalysisResponse, str]:
    priority = _detect_priority(description)
    ai_response = _get_response(priority)

    logger.info(f"Priority: {priority}, Description: {description[:30]}...")
    return AIAnalysisResponse(priority=priority, ai_response=ai_response), "keyword"


def _fallback_analysis(description: str) -> AIAnalysisResponse:
    priority = _detect_priority(description)
    ai_response = _get_response(priority)

    return AIAnalysisResponse(priority=priority, ai_response=ai_response)
