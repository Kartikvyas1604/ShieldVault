import { logger } from '../../utils/logger';

export class NotificationService {
  async notify(walletAddress: string, action: string, metadata: any) {
    // In production, this might trigger emails, Telegram bots, or webhooks.
    // For now, we log the notification.
    logger.info({ walletAddress, action, metadata }, 'User Notification');
  }
}

export const notificationService = new NotificationService();
