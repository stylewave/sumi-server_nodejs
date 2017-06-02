module.exports = {
  task() {
    const taskArray =
      {
        sign: {
          task_id: 1,
          task_title: '完成一次签到',
          task_key: 'sign',
          task_exp: 10,
          task_bonus_beans: 1,
          task_need: 1,
          task_url: 'SignInMain',
          task_db_field: 'task_mission1',
          task_icon_type: 1,
          task_type: 0,
        },


        open_box: {
          task_id: 2,
          task_title: '进行一次寻宝',
          task_key: 'open_box',
          task_exp: 50,
          task_bonus_beans: 5,
          task_need: 1,
          task_url: 'Lottery',
          task_db_field: 'task_mission2',
          task_icon_type: 1,
          task_type: 0,
        },

        in_chatroom: {
          task_id: 4,
          task_title: '进入任意房间',
          task_key: 'in_chatroom',
          task_exp: 50,
          task_bonus_beans: 5,
          task_need: 1,
          task_url: 'RoomList',
          task_db_field: 'task_mission4',
          task_icon_type: 3,
          task_type: 0,
        },

        gift: {
          task_id: 5,
          task_title: '在任意房间中送礼',
          task_key: 'gift',
          task_exp: 50,
          task_bonus_beans: 5,
          task_need: 1,
          task_url: 'RoomList',
          task_db_field: 'task_mission5',
          task_icon_type: 3,
          task_type: 0,
        },
      };
    // console.log(data);
    return taskArray;
  },

};

