const Alice = require('yandex-dialogs-sdk');

const alice = new Alice();

const url = 'https://api.timepad.ru/v1/events.json?sort=-starts_at&starts_at_min=2016-01-01&keywords=uraljs';
const fetch = require('node-fetch');

const events = [];
fetch(url).then(res => res.json()).then(json => events.push(...json.values));

const moment = require('moment');
moment.locale('ru');

alice.command('когда', ctx => {
    const message = moment(events[0].starts_at).format('DD MMMM, dddd, HH:mm');

    ctx.reply(message);
})

alice.command('список', ctx => {
    const items = events.slice(0, 5).map(event => ({
        title: event.name,
        description: moment(event.starts_at).format('DD MMMM YYYY'),
        button: { url: event.url },
    }));

    const card = ctx.replyBuilder
        .card(items)
        .text('Вот список последних мероприятий')
        .get();

    ctx.reply(card);
});

alice.any(ctx => {
    ctx.reply('привет');
});

alice.listen('/', 3333);
