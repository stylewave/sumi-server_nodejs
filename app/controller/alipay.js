const alipay = require('./utils/alipay.js');
module.exports = app => {
  class AlipayController extends app.Controller {
    async pay() {
      // console.log(alipay);
      const url = alipay.alipayto();
      console.log(url);
      // return this.ctx.render('hello.html', {
      //   data: 'world',
      // });

      // https://mclient.alipay.com/home/exterfaceAssign.htm?alipay_exterface_invoke_assign_client_ip=183.15.179.75&body=%E8%B4%AD%E4%B9%B0%E5%92%A8%E8%AF%A2%E8%B1%86(100%E4%B8%AA)&subject=%E8%B4%AD%E4%B9%B0%E5%92%A8%E8%AF%A2%E8%B1%86(100%E4%B8%AA)&sign_type=MD5&notify_url=http%3A%2F%2F192.168.16.16%3A2050%2Fapi%2Fali_paynotify.htm&out_trade_no=1705271431116745&return_url=http%3A%2F%2F192.168.16.16%3A2050%2Fapi%2Fali_wap_payreturn.htm&sign=52ab54c6bd1a1ac881d89025a534d4b3&_input_charset=utf-8&alipay_exterface_invoke_assign_target=mapi_direct_trade.htm&alipay_exterface_invoke_assign_model=cashier&total_fee=10&service=alipay.wap.create.direct.pay.by.user&partner=2088521292039043&seller_id=2088521292039043&alipay_exterface_invoke_assign_sign=_ua%2Bp6_g37%2B_f6_bp%2F_q2_k_v9ij_i928_jq_p_db_x_y_w%2B%2B_brs_sj_k_gmw_bsb_rqz4_h_ew%3D%3D&payment_type=1
      // https://mapi.alipay.com/gateway.do?_input_charset=UTF-8&body=%E5%95%86%E5%93%81%E6%8F%8F%E8%BF%B0&notify_url=http%3A%2F%2F127.0.0.1%3A3000%2Fpaynotify&out_trade_no=20120708132324&partner=2088521292039043&payment_type=1&return_url=http%3A%2F%2F127.0.0.1%3A3000%2Fpayreturn&seller_email=fantongkeji%40163.com&seller_id=2088521292039043&service=alipay.wap.create.direct.pay.by.user&subject=%E5%95%86%E5%93%81%E5%90%8D%E7%A7%B0&total_fee=100&sign=5bd169f746feabd748c6f1018bc0b806&sign_type=MD5

      // https://mclient.alipay.com/home/exterfaceAssign.htm?alipay_exterface_invoke_assign_client_ip=183.15.179.75&body=test&subject=test&sign_type=MD5&notify_url=http%3A%2F%2F127.0.0.1%3A3000%2Fpaynotify&out_trade_no=20120708132324&return_url=http%3A%2F%2F127.0.0.1%3A3000%2Fpayreturn&sign=817e73997cb96236c3e4f750e0716b6d&_input_charset=UTF-8&alipay_exterface_invoke_assign_target=mapi_direct_trade.htm&alipay_exterface_invoke_assign_model=cashier&total_fee=111&service=alipay.wap.create.direct.pay.by.user&partner=2088521292039043&seller_id=2088521292039043&seller_email=fantongkeji%40163.com&alipay_exterface_invoke_assign_sign=_mudn_q_u9_fc_jy_v405%2B_xr7_h_fiovs5t_z_nb_fc65i2h6_j_i0z_l_gz_z_pm_c_iz_x_qg%3D%3D&payment_type=1
    }
  }
  return AlipayController;
};
