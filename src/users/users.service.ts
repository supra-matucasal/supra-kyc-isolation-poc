import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
    });
  }

  async findByUserId(userId: number): Promise<User | null> {
    return this.userModel.findByPk(userId);
  }

  async findOrCreate(email: string): Promise<User> {
    const [user] = await this.userModel.findOrCreate({
      where: { email },
      defaults: {
        email,
        kycStatus: 'pending',
      },
    });
    return user;
  }

  async updateKycStatus(userId: number, status: string): Promise<User> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.kycStatus = status;
    return user.save();
  }
}
