import { IEncryptionService } from '../../domain';

export class DecryptDataUseCase {
  constructor(private readonly encryptionService: IEncryptionService) {}

  execute(cipherText: string): string {
    return this.encryptionService.decrypt(cipherText);
  }
}
