-- HelpDesk PostgreSQL Schema

DROP TABLE IF EXISTS tickets CASCADE;

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    ai_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);

INSERT INTO tickets (title, description, status, priority, ai_response, created_at) VALUES
('Не работает интернет', 'Пропал интернет в офисе, сотрудники не могут работать', 'open', 'high', 'Мы проверим оборудование и свяжемся с провайдером. Ожидайте решение в течение 2 часов.', '2026-04-14 09:00:00'),
('Забыл пароль от почты', 'Не могу войти в рабочую почту, забыл пароль', 'in_progress', 'medium', 'Сейчас сбросим пароль. Вам на почту придет ссылка для восстановления.', '2026-04-14 10:30:00'),
('Нужна новая мышка', 'Сломалась компьютерная мышь, нужна замена', 'closed', 'low', 'Мышь будет доставлена завтра к вам в офис.', '2026-04-13 14:00:00'),
('Ошибка в программе', 'При запуске 1С выходит ошибка "Access denied"', 'open', 'high', 'Нуждается в срочном решении. Вызовите системного администратора.', '2026-04-14 11:00:00'),
('Не печатает принтер', 'Принтер в переговорной не печатает документы', 'open', 'medium', 'Проверим картридж и драйвера. При необходимости заменим картридж.', '2026-04-14 11:30:00'),
('Настройка VPN', 'Нужно настроить удаленный доступ к офисной сети', 'in_progress', 'medium', 'Вышлите ваш IP адрес, мы настроим VPN туннель.', '2026-04-12 16:00:00'),
('Установка Excel', 'Нужна установка Microsoft Excel на новый компьютер', 'closed', 'low', 'Excel установлен. Если нужны дополнительные программы, сообщите.', '2026-04-11 09:00:00'),
('Медленно работает ПК', 'Компьютер стал сильно тормозить после обновления', 'open', 'medium', 'Проведем диагностику и оптимизируем систему.', '2026-04-14 12:00:00');