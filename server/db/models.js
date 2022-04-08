import sequelize from './index.js';
import { DataTypes } from 'sequelize';

const Category = sequelize.define('category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    filters: { type: DataTypes.JSONB, allowNull: true },
});

const Product = sequelize.define('products', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    isAvailable: { type: DataTypes.BOOLEAN, allowNull: false },
    info: { type: DataTypes.JSONB, allowNull: false },
    views: { type: DataTypes.INTEGER, allowNull: false }
});

const ProductPic = sequelize.define('products_pics', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fileName: { type: DataTypes.STRING, allowNull: false },
    seqNum: { type: DataTypes.INTEGER, allowNull: false },
});

const User = sequelize.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    mobileNum: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    isBlocked: { type: DataTypes.BOOLEAN, allowNull: false },
    isActivated: { type: DataTypes.BOOLEAN, allowNull: false },
});

const UserEmails = sequelize.define('users_emails', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    option: { type: DataTypes.STRING, allowNull: false },
    link: { type: DataTypes.STRING },
});

const Cart = sequelize.define('carts', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER }
});

const Review = sequelize.define('reviews', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: { type: DataTypes.FLOAT, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false },
});

const Answer = sequelize.define('answers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    comment: { type: DataTypes.TEXT, allowNull: false },
});

const DeliveryCity = sequelize.define('delivery_cities', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

const DeliveryCompany = sequelize.define('delivery_company', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

const DeliveryDepartment = sequelize.define('delivery_departments', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    adress: { type: DataTypes.STRING, allowNull: false },
});

const PaymentOptions = sequelize.define('payment_options', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

const OrderStatus = sequelize.define('orders_statuses', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    color: { type: DataTypes.STRING, allowNull: false }
})

const Order = sequelize.define('orders', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    mobileNum: { type: DataTypes.STRING, allowNull: true },
    cityName: { type: DataTypes.STRING, allowNull: true },
    companyName: { type: DataTypes.STRING, allowNull: true },
    departmentName: { type: DataTypes.STRING, allowNull: true },
    paymentOptionName: { type: DataTypes.STRING, allowNull: true },
})

const OrderProduct = sequelize.define('orders_products', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    fileName: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
})


Category.hasMany(Category, { foreignKey: { allowNull: true } });
Category.belongsTo(Category);

Category.hasMany(Product, { foreignKey: { allowNull: true } });
Product.belongsTo(Category);

Product.hasMany(ProductPic, { foreignKey: { allowNull: false } });
ProductPic.belongsTo(Product);

Product.hasMany(Cart, { foreignKey: { allowNull: false } });
Cart.belongsTo(Product);
User.hasMany(Cart, { foreignKey: { allowNull: false } });
Cart.belongsTo(User);

User.hasMany(Review, { foreignKey: { allowNull: false } });
Review.belongsTo(User);
Product.hasMany(Review, { foreignKey: { allowNull: false } });
Review.belongsTo(Product);

Review.hasMany(Answer, { foreignKey: { allowNull: false } });
Answer.belongsTo(Review);
User.hasMany(Answer, { foreignKey: { allowNull: false } });
Answer.belongsTo(User);

DeliveryCity.hasMany(DeliveryDepartment, { foreignKey: { allowNull: true } });
DeliveryDepartment.belongsTo(DeliveryCity);

DeliveryCompany.hasMany(DeliveryDepartment, { foreignKey: { allowNull: true } });
DeliveryDepartment.belongsTo(DeliveryCompany);

OrderStatus.hasMany(Order, { foreignKey: { allowNull: false } });
Order.belongsTo(OrderStatus);
User.hasMany(Order, { foreignKey: { allowNull: true } });
Order.belongsTo(User);
DeliveryDepartment.hasMany(Order, { foreignKey: { allowNull: true } });
Order.belongsTo(DeliveryDepartment);
PaymentOptions.hasMany(Order, { foreignKey: { allowNull: true } });
Order.belongsTo(PaymentOptions);

Order.hasMany(OrderProduct, { foreignKey: { allowNull: false } });
OrderProduct.belongsTo(Order);

User.hasMany(UserEmails, { foreignKey: { allowNull: false } });
UserEmails.belongsTo(User);

export {
    Category,
    Product,
    ProductPic,
    User,
    Cart,
    Review,
    Answer,
    DeliveryCity,
    DeliveryCompany,
    DeliveryDepartment,
    PaymentOptions,
    OrderStatus,
    Order,
    OrderProduct,
    UserEmails,
}