let AccountTransactionModel = require('../models/account');

class AccountController {

    static reset (req, res) {
        AccountTransactionModel.reset();
        res.status(200).end();
    }

    static handle_event (req, res) {
        let { destination, amount } = req.body,
            transaction = new AccountTransactionModel(destination),
            balance = transaction.deposit(amount).balance();

        res.status(201).json({"destination": balance});
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
