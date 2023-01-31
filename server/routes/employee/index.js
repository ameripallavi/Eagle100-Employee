import { Router } from "express";

import { createUser } from "../../services/employee/index.js";

const router = Router();

//router.route('/emp')
    // .get(async function (req, res, next) {
    //     try {
    //         const result = await getEmpList();
    //         return res.status(200).send(result);
    //     } catch (err) {
    //         console.error(`Error while fetching the user`.err.messagge);
    //         return res.status(500).send(error);
    //     }
    // })
    router.route('/empinsert')
    .post(async function (req, res, next) {
        try {
            const result = await createUser(req.body);
            return res.status(200).send(result);
        } catch (err) {
            console.error(`Error while posting the user`.err.messagge);
            return res.status(500).send(error);
        }
    })
    // router.route('/empupdate')
    // .put(async function (req, res, next) {
    //     try {
    //         res.json(await updateEmp(req.body));
    //         console.log(req.body);
    //     } catch (err) {
    //         console.error(`Error while posting the user`.err.messagge);
    //         next(err);
    //     }
    // })
    // router.route('/empdelete')
    // .delete(async function (req, res, next) {
    //     try {
    //         res.json(await deleteEmp(req.body));
    //         console.log(req.body);
    //     } catch (err) {
    //         console.error(`Error while deleting the user`.err.messagge);
    //         next(err);
    //     }
    // });




export default router;