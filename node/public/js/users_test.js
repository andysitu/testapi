class UsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    }
    this.get_users();
  }

  get_users = () => {
    var that = this;
    $.ajax({
      url: "./get_users",
      success:function(data) {
        console.log(data);
        that.setState({
          users: data,
        })
      }
    });
  }

  onClick_phone = (e) => {
    var user_id = e.target.getAttribute("user_id");
    var phone = window.prompt("Please enter a phone number (format: nnn-nnn-nnnn)");
    var re = /^\d{3}-\d{3}-\d{4}$/;
    var result = re.exec(phone);
    if (result) {
      $.ajax({
        url: "./" + user_id,
        type: "PATCH",
        success: function(data) {
          console.log("edi");
        },
        data: {
          property: "phone",
          value: result[0]
        },
      })
    } else {
      window.alert("Wrong phone format");
    }

  }
  onClick_email = (e) => {
    console.log(e.target.getAttribute("user_id"));
  }

  render() {
    return (<table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>options</th>
        </tr>
      </thead>
      <tbody>
        {this.state.users.map((user) => {
          return (
          <tr>
            <td>{user.name_title + " " + user.name_first + " " + user.name_last }</td>
            <td>{user.phone}</td>
            <td>{user.email}</td>
            <td>
              <button user_id={user._id}
                onClick={this.onClick_phone}>edit phone</button>
              <button user_id={user._id}
                onClick={this.onClick_email}>edit email</button>
            </td>
          </tr>);
        })}
      </tbody>
    </table>);
  }
}

// $.ajax({
//   url: "./get_users",
//   success:function(data) {
//     console.log(data);
//   }
// });


ReactDOM.render(<UsersTable />, document.getElementById("usersContainer"));