// utils/passwordHash.ts
import crypto from 'crypto';

export class PasswordHash {
  private itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  private cryptPrivate(password: string, storedHash: string): string {
    let output = '*0';
    if (storedHash.startsWith(output)) {
      output = '*1';
    }

    const id = storedHash.substring(0, 3);
    if (id !== '$P$' && id !== '$H$') {
      return output;
    }

    const countLog2 = this.itoa64.indexOf(storedHash[3]);
    if (countLog2 < 7 || countLog2 > 30) {
      return output;
    }

    let count = 1 << countLog2;
    const salt = storedHash.substring(4, 12);
    if (salt.length !== 8) {
      return output;
    }

    let hash = crypto.createHash('md5').update(salt + password, 'utf8').digest("binary");
    do {
      hash = crypto.createHash('md5').update(hash + password, 'binary').digest("binary");
    } while (--count);

    output = storedHash.substring(0, 12);
    output += this.encode64(Buffer.from(hash, 'binary'), 16);

    return output;
  }

  private encode64(input: Buffer, count: number): string {
    let output = '';
    let i = 0;
    let value;

    do {
      value = input[i++];
      output += this.itoa64[value & 0x3f];
      if (i < count) {
        value |= input[i] << 8;
      }
      output += this.itoa64[(value >> 6) & 0x3f];
      if (i++ >= count) {
        break;
      }
      if (i < count) {
        value |= input[i] << 16;
      }
      output += this.itoa64[(value >> 12) & 0x3f];
      if (i++ >= count) {
        break;
      }
      output += this.itoa64[(value >> 18) & 0x3f];
    } while (i < count);

    return output;
  }

  public checkPassword(password: string, storedHash: string): boolean {
    const hash = this.cryptPrivate(password, storedHash);
    console.log(hash, storedHash)
    return hash === storedHash;
  }
}