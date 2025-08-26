import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  letteraTechNumber?: string;
  codePhrases?: string[];
  avatar?: string;
  bio?: string;
  status?: string;
  location?: string;
  website?: string;
  skills?: string[];
  role: 'user' | 'freelancer' | 'startup' | 'admin';
  isEmailVerified: boolean;
  isActive: boolean;
  twoFactorEnabled?: boolean;
  emailNotifications?: boolean;
  profile: {
    portfolio?: string[];
    rating?: number;
    completedProjects?: number;
    followers?: number;
    following?: number;
    joinDate?: Date;
  };
  emailVerificationCode?: string;
  emailVerificationExpires?: Date;
  passwordResetCode?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateLetteraTechNumber(): string;
  generateCodePhrases(): string[];
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot be more than 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  letteraTechNumber: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\+11111\d{11}$/, 'Invalid LetteraTech number format']
  },
  codePhrases: [{
    type: String,
    select: false
  }],
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'freelancer', 'startup', 'admin'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: ''
  },
  status: {
    type: String,
    maxlength: [200, 'Status cannot be more than 200 characters'],
    default: ''
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot be more than 100 characters'],
    default: ''
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  profile: {
    portfolio: [{
      type: String
    }],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    completedProjects: {
      type: Number,
      default: 0
    },
    followers: {
      type: Number,
      default: 0
    },
    following: {
      type: Number,
      default: 0
    },
    joinDate: {
      type: Date,
      default: Date.now
    }
  },
  emailVerificationCode: String,
  emailVerificationExpires: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  emailNotifications: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Index for search
userSchema.index({
  firstName: 'text',
  lastName: 'text',
  username: 'text',
  bio: 'text',
  status: 'text'
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Pre-save middleware to hash code phrases
userSchema.pre('save', async function(next) {
  if (!this.isModified('codePhrases')) return next();
  
  if (this.codePhrases && this.codePhrases.length > 0) {
    this.codePhrases = await Promise.all(
      this.codePhrases.map(phrase => bcrypt.hash(phrase, 12))
    );
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to compare code phrase
userSchema.methods.compareCodePhrase = async function(candidatePhrase: string, index: number): Promise<boolean> {
  if (!this.codePhrases || !this.codePhrases[index]) return false;
  return bcrypt.compare(candidatePhrase, this.codePhrases[index]);
};

// Method to generate LetteraTech number
userSchema.methods.generateLetteraTechNumber = function(): string {
  const base = '+11111';
  const random = Math.floor(Math.random() * 10000000000).toString().padStart(11, '0');
  return base + random;
};

// Method to generate code phrases
userSchema.methods.generateCodePhrases = function(): string[] {
  const adjectives = [
    'swift', 'quiet', 'bright', 'dark', 'tall', 'short', 'wide', 'narrow',
    'hot', 'cold', 'soft', 'hard', 'sharp', 'dull', 'long', 'quick'
  ];
  const nouns = [
    'wolf', 'eagle', 'sea', 'mountain', 'star', 'moon', 'sun', 'forest', 'river', 'stone',
    'fire', 'ice', 'wind', 'rain', 'snow', 'thunder', 'lightning', 'mist'
  ];
  const numbers = Array.from({length: 100}, (_, i) => (i + 1).toString());

  const phrases: string[] = [];
  for (let i = 0; i < 12; i++) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    phrases.push(`${adjective}-${noun}-${number}`);
  }
  return phrases;
};

// Static method to find user by login (email, username, or LetteraTech number)
userSchema.statics.findByLogin = function(login: string) {
  const query: any = { isActive: true };
  
  if (login.startsWith('+11111')) {
    query.letteraTechNumber = login;
  } else if (login.includes('@')) {
    query.email = login.toLowerCase();
  } else {
    query.username = login.toLowerCase();
  }
  
  return this.findOne(query).select('+password +codePhrases');
};

export default mongoose.model<IUser>('User', userSchema);