const express = require('express');
const { status } = require('express/lib/response');

const app = express();
app.use(express.json());

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'ddugky.cvp2xv0yjwxm.ap-south-1.rds.amazonaws.com',
    user: 'readdata',
    password: 'Ddugky@789',
    database: 'kaushalbharat'

});


var query_data = [];
var final_data = [];
var send_data = {};
var can_satatus;
app.get('/api/data/:id', (req, res) => {

    input = req.params.id;

    var arr = input.split("=");

    var input_name = arr[0];
    var input_value = arr[1];
    if (input_name = 'sanction_orders') {
        queryString = "SELECT master_state.name as state,sanction_orders.pia_name,prn_basic.prn_name_organisation, sanction_orders.sanction_order,training_centre.id as centre_id, training_centre.tc_name,training_centre.state as tc_state,master_district.name as tc_dist,candidate_registration.kaushal_panjee_id, candidate_registration.id as cand_id, candidate_registration.first_name,candidate_registration.last_name,batch.id as batch_id,candidate_registration.dob,batch.old_batch_code,batch.trade_code, batch.start_date,batch.end_date, candidate_registration.dob,candidate_registration.gender,candidate_registration.cand_religion,candidate_registration.minority,candidate_registration.pwd,candidate_residence_details.perm_state,candidate_residence_details.perm_dist,candidate_residence_details.perm_block,candidate_residence_details.perm_gram,candidate_residence_details.parliamentary,candidate_residence_details.assembly,candidate_registration.mobile,candidate_registration.email,  candidate_family_details.member_name,candidate_registration.category FROM candidate_registration  inner join training_centre on training_centre.id=candidate_registration.center_id inner join sanction_orders on training_centre.santion_order=sanction_orders.id inner join prn_basic on sanction_orders.pia_name=prn_basic.prn_no inner join master_state on sanction_orders.state=master_state.id  inner join candidate_enrollment on  candidate_enrollment.candidate_id=candidate_registration.id  INNER join batch on candidate_enrollment.batch_id=batch.id inner join master_district on training_centre.district=master_district.id INNER JOIN candidate_residence_details on candidate_registration.id=candidate_residence_details.cand_id LEFT JOIN candidate_family_details on candidate_family_details.cand_id=candidate_registration.id  where sanction_orders.status=1 and candidate_registration.status=1 and candidate_family_details.member_relation='Father' and  candidate_enrollment.status=1 and sanction_orders.state='" + input_value + "'group by candidate_registration.id";
    }
    else if (input_name = 'ram') {

    }

    connection.query(queryString, function (err, result) {
        if (err) throw err;
        query_data = result;

        for (var i in query_data) {
            item = query_data[i];
            // -------------- for our data ------------
            state = item.state;
            pia_name = item.pia_name;
            prn_name_organisation = item.prn_name_organisation;
            sanction_order = item.sanction_order;
            centre_id = item.centre_id;
            tc_name = item.tc_name;
            tc_state = item.tc_state;
            tc_dist = item.tc_dist;
            kaushal_panjee_id = item.kaushal_panjee_id;
            first_name = item.first_name;
            last_name = item.last_name;
            batch_id = item.batch_id;
            dob = item.dob;
            old_batch_code = item.old_batch_code;
            trade_code = item.trade_code;
            start_date = item.start_date;
            end_date = item.end_date;
            gender = item.gender;
            cand_religion = item.cand_religion;
            minority = item.minority;
            pwd = item.pwd;
            perm_state = item.perm_state;
            perm_dist = item.perm_dist;
            perm_block = item.perm_block;
            perm_gram = item.perm_gram;
            parliamentary = item.parliamentary;
            assembly = item.assembly;
            mobile = item.mobile;
            email = item.email;
            member_name = item.member_name;
            category = item.category;
            cand_id = item.cand_id;
            // --------- end----------------

            // --------------   for new arrey----------------------

            send_data['state'] = state;
            send_data['pia_name'] = pia_name;
            send_data['prn_name_organisation'] = prn_name_organisation;
            send_data['sanction_order'] = sanction_order;
            send_data['centre_id'] = centre_id;
            send_data['tc_name'] = tc_name;
            send_data['tc_state'] = tc_state;
            send_data['tc_dist'] = tc_dist;
            send_data['kaushal_panjee_id'] = kaushal_panjee_id;
            send_data['cand_id'] = cand_id;
            send_data['first_name'] = first_name;
            send_data['last_name'] = last_name;
            send_data['batch_id'] = batch_id;
            send_data['dob'] = dob;
            send_data['old_batch_code'] = old_batch_code;
            send_data['trade_code'] = trade_code;
            send_data['start_date'] = start_date;
            send_data['end_date'] = end_date;
            send_data['gender'] = gender;
            send_data['cand_religion'] = cand_religion;
            send_data['minority'] = minority;
            send_data['pwd'] = pwd;
            send_data['perm_state'] = perm_state;
            send_data['perm_dist'] = perm_dist;
            send_data['perm_block'] = perm_block;
            send_data['perm_gram'] = perm_gram;
            send_data['parliamentary'] = parliamentary;
            send_data['assembly'] = assembly;
            send_data['mobile'] = mobile;
            send_data['email'] = email;
            send_data['member_name'] = member_name;
            send_data['category'] = category;
            send_data['status'] = can_satatus;
            // --------------------     end         ------------------
            // --------------   for dropout_query ----------------
            dropout_query = "SELECT candidate_dropout.id FROM `candidate_dropout` WHERE status=1 and candidate_id='" + cand_id + "'";
            connection.query(dropout_query, function (err, dropout_result) {

                if (err) throw err;


                if (dropout_result.length > 0) {
                    can_satatus = "dropout";
                }
                // final_data.push(send_data);
            });
            // ==========================   FOR Placed  =====================================
            appointed_query = "SELECT candidate_id FROM placement_appointment WHERE status=1 and candidate_id='" + cand_id + "'";
            connection.query(appointed_query, function (err, placed_result) {
                if (err) throw err;

                if (placed_result.length > 0) {
                    can_satatus= "appointed";
                }
                // final_data.push(send_data);
                
            });

            final_data.push(send_data);

        }

        console.log(final_data);
        res.send(final_data);
        // connection.end();
    });

});


//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));