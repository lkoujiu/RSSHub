import { Route } from '@/types';
import got from '@/utils/got';
import { load } from 'cheerio';
import { parseDate } from '@/utils/parse-date';

const host = 'https://yxy.zcmu.edu.cn/';

const map = new Map([
    [0, { title: '药学院 -- 通知公告', id: 'index/tzgg' }],
    [1, { title: '药学院 -- 评优评奖', id: 'xsgz/pypj' }],
    [2, { title: '药学院 -- 文明规范', id: 'xsgz/wmgf' }],
    [3, { title: '药学院 -- 创新创业', id: 'xsgz/cxcy' }],
    [4, { title: '药学院 -- 校园文化', id: 'xsgz/xywh' }],
    [5, { title: '药学院 -- 心理驿站', id: 'xsgz/xlyz' }],
    [6, { title: '药学院 -- 日常通知', id: 'xsgz/rctz' }],
]);

export const route: Route = {
    path: '/yxy/:type?',
    categories: ['university'],
    example: '/zcmu/yxy/0',
    parameters: { type: '模块id' },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: '药学院',
    maintainers: ['CCraftY'],
    handler,
    description: `| 通知公告 | 评优评奖 | 文明规范 | 创新创业 | 校园文化 | 心理驿站 | 日常通知 |
| -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| 0        | 1        | 2        | 3        | 4        | 5        | 6        |`,
};

async function handler(ctx) {
    const type = Number.parseInt(ctx.req.param('type'));
    const id = map.get(type).id;
    const res = await got({
        method: 'get',
        url: `${host}/${id}.htm`,
    });

    const $ = load(res.data);
    const items = $('.lm_list li')
        .map((index, item) => {
            item = $(item);
            return {
                title: item.find('a').text(),
                link: `https://yxy.zcmu.edu.cn/${item.find('a').attr('href')}`,
                pubDate: parseDate(item.find('span').text().trim()),
            };
        })
        .get();

    return {
        title: map.get(type).title,
        link: `${host}${id}`,
        item: items,
    };
}
