import { getRepository } from 'typeorm';
import { SupportAgent } from '../entity/supportAgent';

export default class SupportAgentService {
    static async getAvailableSupportAgent(): Promise<SupportAgent> {
        return getRepository(SupportAgent)
            .findOne({
                where: {
                    available: true,
                }
            });
    }

    static async setAgentToAvailable(supportAgentId: string): Promise<void> {
        await getRepository(SupportAgent)
            .update(
                { id: supportAgentId },
                { available: true },
            );
    }
}