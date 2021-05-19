const {Router} = require('express');
const router = Router();
const config = require('config');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');

router.post(
    '/register',
    [
        check('login', 'Некорректный логин').isLength({min: 1}),
        check('password', 'Неверная длина пароля').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        console.log(req.body);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: "Некорректные данные регистрации" });
        }

        const {login, password} = req.body;
        const candidate = await User.findOne({login});

        if ( candidate ) {
            return res.status(400).json( {message: 'Пользователь уже существует'} );
        }

        const passHash = await bcript.hash(password, 12);
        const user = new User({login, password: passHash});
        await user.save();
        res.status(201).json({ message: 'Пользователь создан' });

    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

router.post('/login',
    [
        check('login', 'Некорректный логин').exists(),
        check('password', 'Неверная длина пароля').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: "Некорректные данные авторизации" });
        }

        const {login, password} = req.body;
        const user = await User.findOne({login});
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        const isMatch = bcript.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль' });
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        );

        res.json({ token, userId: user.id });

    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

module.exports = router;