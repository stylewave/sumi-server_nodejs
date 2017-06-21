module.exports = {
  job() {

    const jobArray = {
      job: [
        {
          job_id: '1',
          job_name: '赌神',
          job_description: '赌神赌神赌神赌神,我是赌神!',
          job_icon: 'http://sumi.cf69.com/public/images/icon/user_default.png',
          list: [{ level: '1', title: '赌客', key: 'icon', value: 'http://sumi.cf69.com/public/images/icon/user_default.png', description: '赌道开端，直播间中会获得扑克小徽章！' },
          { level: '20', title: '千王', key: 'nomal_box_count1', value: '2', description: '千道出奇制胜，每日可获取2次免费砸开好运蛋的机会！' },
          { level: '40', title: '赌神', key: 'new_box', value: '3', description: '赌神的奥义，就是想要什么出什么，可砸破发财蛋！' },
          ],
        },
        {
          job_id: '2',
          job_name: '股神',
          job_description: '股神股神股神股神,我是股神!!',
          job_icon: 'http://sumi.cf69.com/public/images/icon/user_default.png',
          list: [{ level: '1', title: '韭菜', key: 'icon', value: 'http://sumi.cf69.com/public/images/icon/user_default.png', description: '投资之路开始啦，直播间中会获得韭菜小徽章！' },
          { level: '20', title: '操盘手', key: 'sign_more_bean1', value: '5', description: '做为一个熟练的操盘手，每日签到额外获得5赠豆！' },
          { level: '40', title: '股神', key: 'sign_more_bean2', value: '15', description: '万众敬仰的股神，每日签到额外获得15赠豆！！' },
          ],
        },
        {
          job_id: '3',
          job_name: '财神',
          job_description: '财神财神财神财神,我是财财神!!',
          job_icon: 'http://sumi.cf69.com/public/images/icon/user_default.png',
          list: [{ level: '1', title: '商人', key: 'icon', value: 'http://sumi.cf69.com/public/images/icon/user_default.png', description: '奔向小康的道路，直播间中或获得商人小徽章！' },
          { level: '20', title: '巨商', key: 'recharge_more_bean1', value: '2', description: '作为一个巨商，每次充值都会额外获取2%赠豆！' },
          { level: '40', title: '财神', key: 'recharge_more_bean2', value: '3', description: '财神爷不缺钱！每次充值都会额外获取3%赠豆！' },
          ],
        },
      ],
      skill: {
        nomal_box_count1: { level: '20', title: '千王', key: 'nomal_box_count1', value: '2', description: '千道出奇制胜，每日可获取2次免费砸开好运蛋的机会！' },
        new_box: { level: '40', title: '赌神', key: 'new_box', value: '3', description: '赌神的奥义，就是想要什么出什么，可砸破发财蛋！' },
        sign_more_bean1: { level: '20', title: '操盘手', key: 'more_bean1', value: '5', description: '做为一个熟练的操盘手，每日签到额外获得5赠豆！' },
        sign_more_bean2: { level: '40', title: '股神', key: 'more_bean2', value: '15', description: '万众敬仰的股神，每日签到额外获得15赠豆！！' },
        recharge_more_bean1: { level: '20', title: '巨商', key: 'recharge_more_bean1', value: '2', description: '作为一个巨商，每次充值都会额外获取2%赠豆！' },
        recharge_more_bean2: { level: '40', title: '财神', key: 'recharge_more_bean2', value: '3', description: '财神爷不缺钱！每次充值都会额外获取3%赠豆！' },
      },

    };
    // console.log(data);
    return jobArray;
  },

};

