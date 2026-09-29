import { IEncryptionService } from '../../domain';

export class EncryptDataUseCase {
  constructor(private readonly encryptionService: IEncryptionService) {}

  execute(plainText: string): string {
    return this.encryptionService.encrypt(plainText);
  }
}
