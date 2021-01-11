let AccountTransactionModel = require('../models/account');

class AccountController {

    static reset (req, res) {
        AccountTransactionModel.reset();
        res.status(200).end();
    }

    static handle_event (req, res) {
        let { type, origin, destination, amount } = req.body,
            transaction, result;

        if (type === 'withdraw') {
            transaction = new AccountTransactionModel(origin);
            result = transaction.withdraw(amount).balance();
            if (result['balance'] === undefined)
                res.status(404).end('0');
            else
                res.status(201).json({"origin": result});
        } else {
            transaction = new AccountTransactionModel(destination);
            result = transaction.deposit(amount).balance();
            res.status(201).json({"destination": result});
        }

    }

    static balance (req, res) {
        let { account_id } = req.query,
            transaction = new AccountTransactionModel(account_id),
            result = transaction.balance();

        if (result['balance'] === undefined)
            res.status(404).end('0');
        else
            res.status(200).end(`${result['balance']}`);
    }

}

module.exports = AccountController;
