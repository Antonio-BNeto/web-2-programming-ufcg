
import User from './User';
import Sale from './Sale';
import Item from './Item';
import Payment from './Payment';
import SaleItem from './SaleItem';

export const setupAssociations = () => {
    User.hasMany(Sale, { foreignKey: 'userId', as: 'sales' });
    Sale.belongsTo(User, { foreignKey: 'userId', as: 'vendedor' });

    Sale.hasMany(Payment, { foreignKey: 'saleId', as: 'pagamentos' });
    Payment.belongsTo(Sale, { foreignKey: 'saleId', as: 'venda' });

    Sale.belongsToMany(Item, {
        through: SaleItem,
        as: 'itens',
        foreignKey: 'saleId'
    });

    Item.belongsToMany(Sale, {
        through: SaleItem,
        as: 'vendas',
        foreignKey: 'itemId'
    });
};

export { User, Sale, Item, Payment };