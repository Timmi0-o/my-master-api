import { HandlebarsTemplateRenderer } from 'src/modules/shared/infrastructure/templating/handlebars-template.renderer';
import { EAppointmentReminderJobType } from 'src/modules/appointments/domain/entities/appointment-reminder-job';
import { NotificationMessageCatalog } from 'src/modules/notifications/infrastructure/i18n/notification-message-catalog';
import { NotificationType } from 'src/modules/notifications/domain/entities/notification';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';

describe('NotificationMessageCatalog', () => {
  const catalog = new NotificationMessageCatalog(
    new HandlebarsTemplateRenderer(),
  );

  it('resolves APPOINTMENT_CREATED in RU with formatted date', () => {
    const result = catalog.resolve(EUserLanguage.RU, {
      type: NotificationType.APPOINTMENT_CREATED,
      date: new Date('2026-08-01T12:00:00.000Z'),
    });

    expect(result.title).toBe('У вас новая запись');
    expect(result.body).toMatch(/^Новая запись от \d{2}\.\d{2}\.\d{4}$/);
  });

  it('resolves APPOINTMENT_CONFIRMED in EN', () => {
    const result = catalog.resolve(EUserLanguage.EN, {
      type: NotificationType.APPOINTMENT_CONFIRMED,
      serviceName: 'Haircut',
    });

    expect(result).toEqual({
      title: 'Appointment confirmed',
      body: 'The master confirmed «Haircut»',
    });
  });

  it('resolves APPOINTMENT_CANCELLED with serviceName interpolation', () => {
    const result = catalog.resolve(EUserLanguage.RU, {
      type: NotificationType.APPOINTMENT_CANCELLED,
      serviceName: 'Маникюр',
    });

    expect(result).toEqual({
      title: 'Запись отменена',
      body: 'Запись «Маникюр» отменена',
    });
  });

  it('resolves APPOINTMENT_REMINDER with localized reminder label', () => {
    const result = catalog.resolve(EUserLanguage.EN, {
      type: NotificationType.APPOINTMENT_REMINDER,
      serviceName: 'Haircut',
      reminderType: EAppointmentReminderJobType.REMINDER_2H,
    });

    expect(result).toEqual({
      title: 'Appointment reminder',
      body: 'Appointment «Haircut» in 2 hours',
    });
  });

  it('resolves CHAT_MESSAGE title and keeps provided body', () => {
    const result = catalog.resolve(EUserLanguage.RU, {
      type: NotificationType.CHAT_MESSAGE,
      body: 'Привет!',
    });

    expect(result).toEqual({
      title: 'Новое сообщение',
      body: 'Привет!',
    });
  });

  it('falls back to EN placeholders for non-RU/EN languages', () => {
    const result = catalog.resolve(EUserLanguage.DE, {
      type: NotificationType.APPOINTMENT_CONFIRMED,
      serviceName: 'Cut',
    });

    expect(result.title).toBe('Appointment confirmed');
    expect(result.body).toContain('Cut');
  });
});
