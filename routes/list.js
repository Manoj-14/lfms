module.exports = {
  restList: (req, res) => {
    if (req.cookies.username == undefined) {
      res.render("login/admin-login.ejs", {
        title: "Admin Login",
        status: "Please login again",
      });
    } else {
      db.query("Select * from restaurant", (err, rows) => {
        res.render("lists/rest-list.ejs", {
          title: "Admin Dashboard || Restaurent list",
          length: rows.length,
          admin_prof: true,
          rest_prof: false,
          ngo_prof: false,
          nav_stat: "admin-rest",
          nav_title: "Restaurants list",
          rows,
        });
      });
    }
  },
  ngoList: (req, res) => {
    if (req.cookies.username == undefined) {
      res.render("login/admin-login.ejs", {
        title: "Admin Login",
        status: "Please login again",
      });
    } else {
      db.query("Select * from ngo", (err, rows) => {
        res.render("lists/ngo-list.ejs", {
          title: "Admin Dashboard || NGO's List",
          length: rows.length,
          admin_prof: true,
          nav_title: "NGO's list",
          rest_prof: false,
          nav_stat: "admin-ngo",
          ngo_prof: false,
          rows,
        });
      });
    }
  },
  orderList: (req, res) => {
    if (req.cookies.username == undefined) {
      res.render("login/admin-login.ejs", {
        title: "Admin Login",
        status: "Please login again",
      });
    } else {
      db.query(
        "select O.order_no,D.Date,D.Name , D.Phone ,D.Quantity,D.Pincode,D.desc,O.status from orders O,donors D WHERE O.order_no = D.SEND_ID and status = ? order by O.order_no",
        ["Waiting for admin"],
        (err, rows) => {
          console.log(rows);
          res.render("lists/orders.ejs", {
            title: "Admin Dashboard || Orders",
            length: rows.length,
            admin_prof: true,
            rest_prof: false,
            ngo_prof: false,
            nav_title: "Orders",
            nav_stat: "admin-order",
            rows,
          });
        }
      );
    }
  },
  logList: (req, res) => {
    if (req.cookies.username == undefined) {
      res.render("login/admin-login.ejs", {
        title: "Admin Login",
        status: "Please login again",
      });
    } else {
      const username = req.cookies.username;
      db.query(
        "SELECT D.SEND_ID,L.date,D.Name,D.Pincode,D.Quantity,O.status,'Not Accepted' as ngo  from donors D,log L,orders O,ngo N where D.SEND_ID = L.order_no and O.order_no =L.order_no and L.ngo_uid is NULL and O.aproved_admin = ? UNION SELECT D.SEND_ID,L.date,D.Name,D.Pincode,D.Quantity,O.status,N.Name from donors D,log L,orders O,ngo N where D.SEND_ID = L.order_no and O.order_no =L.order_no and N.ngo_unique_id=L.ngo_uid and O.aproved_admin = ? order by date desc",
        [username, username],
        (err, rows) => {
          if (err) {
            console.log(err);
          } else {
            db.query(
              "SELECT O.order_no , D.name,D.Phone,D.Quantity,D.desc , O.ordered_Date from orders O , donors D WHERE O.order_no = D.SEND_ID AND O.status = ?",
              ["Expried"],
              (err, results) => {
                console.log(results);
                res.render("lists/history.ejs", {
                  title: "Admin Dashboard || History",
                  length: rows.length,
                  resLen: results.length,
                  admin_prof: true,
                  rest_prof: false,
                  ngo_prof: false,
                  nav_stat: "admin-log",
                  nav_title: "History",
                  rows,
                  results,
                });
              }
            );
            // console.log(rows);
          }
        }
      );
    }
  },
  restLog: (req, res) => {
    if (req.cookies.restDet == undefined) {
      res.render("login/restaurant-login.ejs", {
        title: "Res Login",
        status: "Please login again",
      });
    }
    // console.log(req.cookies.restDet == undefined);
    else {
      const restEmail = req.cookies.restDet.restEmail;
      const restName = req.cookies.restDet.restName;
      db.query(
        "SELECT D.SEND_ID,L.date,D.Name,D.Pincode,D.Quantity,O.status,'Not Accepted' as ngo  from donors D,log L,orders O,ngo N where D.SEND_ID = L.order_no and O.order_no =L.order_no and L.ngo_uid is NULL and  D.Name = ? UNION SELECT D.SEND_ID,L.date,D.Name,D.Pincode,D.Quantity,O.status,N.Name from donors D,log L,orders O,ngo N where D.SEND_ID = L.order_no and O.order_no =L.order_no and N.ngo_unique_id=L.ngo_uid and  D.Name = ? ;",
        [restName, restName],
        (err, rows) => {
          if (err) {
            console.log(err);
          } else {
            db.query(
              "select O.order_no,O.ordered_Date,O.status,D.Quantity from orders O ,donors D where O.order_no = D.SEND_ID and D.Name = ? and O.status = ?",
              [restName, "Waiting for admin"],
              (err, results) => {
                if (err) {
                  console.log(err);
                }
                res.render("lists/rest-log.ejs", {
                  title: "Rest Log",
                  admin_prof: false,
                  rest_prof: true,
                  ngo_prof: false,
                  nav_title: "Log",
                  nav_stat: "rest-log",
                  rowsLen: rows.length,
                  resLen: results.length,
                  results,
                  rows,
                });
              }
            );
          }
        }
      );
    }
  },
  ngoLog: (req, res) => {
    if (req.cookies.ngoDet == undefined) {
      res.render("login/ngo-login.ejs", {
        title: "Ngo Login",
        status: "Please login again",
      });
    } else {
      const ngoEmail = req.cookies.ngoDet.ngo_email;
      const ngoName = req.cookies.ngoDet.ngo_name;
      const ngoUid = req.cookies.ngoDet.ngo_uid;
      console.log(ngoName, ngoEmail, ngoUid);
      db.query(
        "SELECT D.SEND_ID,L.date,D.Name,D.Pincode,D.Quantity from donors D,log L,orders O,ngo N where D.SEND_ID = L.order_no and O.order_no =L.order_no and N.ngo_unique_id=L.ngo_uid and L.ngo_uid = ? order by date desc",
        [ngoUid],
        (err, rows) => {
          console.log(rows);
          res.render("lists/ngo-log.ejs", {
            title: "Ngo Log",
            admin_prof: false,
            rest_prof: false,
            ngo_prof: true,
            nav_title: "Log",
            nav_stat: "ngo-log",
            length: rows.length,
            rows,
          });
        }
      );
    }
  },
};
