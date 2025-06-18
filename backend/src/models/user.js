import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3],
        msg: "First Name must contain at least 3 characters",
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3],
        msg: "Last Name must contain at least 3 characters",
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Invalid email address"
      }
    }
  },
  phone: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      is: {
        args: /^\d{10}$/,
        msg: "Phone number must be exactly 10 digits"
      }
    }
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female"),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("Admin", "Patient", "Doctor"),
    allowNull: false,
  },
  otp: {
  type: DataTypes.STRING,
  allowNull: true,
},
otpExpires: {
  type: DataTypes.DATE,
  allowNull: true,
}
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Add method to compare password
User.prototype.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

export default User; // ✅ default export
