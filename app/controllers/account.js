let AccountTransactionModel = require('../models/account');

class AccountController {

    static reset (req, res) {
        AccountTransactionModel.reset();
        res.status(200).end();
    }

    static handle_event (req, res) {
        let { type, origin, destination, amount } = req.body,
            transaction, transaction2, result, result2;

        switch (type) {
            case 'deposit':
                transaction = new AccountTransactionModel(destination);
                result = transaction.deposit(amount).balance();
                res.status(201).json({"destination": result});
                break;
            case 'withdraw':
                transaction = new AccountTransactionModel(origin);
                result = transaction.withdraw(amount).balance();
                if (result === null)
                    res.status(404).end('0');
                else
                    res.status(201).json({"origin": result});
                break;
            case 'transfer':
                transaction = new AccountTransactionModel(origin);
                transaction2 = new AccountTransactionModel(destination);
                result = transaction.transfer(destination, amount).balance();
                result2 = transaction2.balance();
                if (result === null)
                    res.status(404).end('0');
                else
                    res.status(201).json({"origin": result, "destination": result2});
                break;
        }

    }

    static balance (req, res) {
        let { account_id } = req.query,
            transaction = new AccountTransactionModel(account_id),
            result = transaction.balance();

        if (result === null)
            res.status(404).end('0');
        else
            res.status(200).end(`${result['balance']}`);
    }

}

module.exports = AccountController;
