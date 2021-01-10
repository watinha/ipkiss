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

}

module.exports = AccountController;
