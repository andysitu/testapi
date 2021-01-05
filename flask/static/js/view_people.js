class UsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Initially data will be the same as users
      // Then, users contain elements that are shown in page
      data: [],
      users: [],
    }
    this.email_sort_asecend = true;
    this.name_first_sort_ascend = true;
    this.get_people();
  }

  get_people = () => {
    var that = this;
    $.ajax({
      url: "./get_people",
      success:function(data) {
        that.setState({
          data: data,
          users: data,
        })
      }
    });
  }

  edit_people_property = (people_id, property_type, value, callback) => {
    $.ajax({
      contentType: 'application/json',
      url: "people/" + people_id,
      type: "PATCH",
      success: function(data) {
        if (callback)
          callback(data);
      },
      data: JSON.stringify({
        property: property_type,
        value: value
      }),
    });
  }

  onClick_phone = (e) => {
    var phone = window.prompt("Please enter a phone number (format: nnn-nnn-nnnn)");
    var re = /^\d{3}-\d{3}-\d{4}$/;
    var result = re.exec(phone);
    if (result) {
      var people_id = e.target.getAttribute("people_id"),
          index = e.target.getAttribute("index");
      var that = this;
      that.edit_people_property(people_id, "phone", phone, ()=> {
        that.setState(state => {
          state.users[index].phone = phone;

          return {users: state.users};
        });
      });
    } else {
      window.alert("Wrong phone format");
    }

  }
  onClick_email = (e) => {
    var email = window.prompt("Please enter an email"),
        re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
    var result = re.exec(email);
    if (result) {
      var people_id = e.target.getAttribute("people_id"),
          index = e.target.getAttribute("index"),
          that = this;
      that.edit_people_property(people_id, "email", email, ()=> {
        that.setState(state => {
          state.users[index].email = email;

          return {users: state.users};
        });
      });
    }
  }

  onClick_sort_first_name = () => {
    var that = this;
    this.setState((state)=> {
      state.users.sort(function(a, b) {
        var nameA = a.name_first.toLowerCase(),
            nameB = b.name_first.toLowerCase();
        if (nameA < nameB) {
          return that.name_first_sort_ascend ? -1 : 1
        } 
        if (nameA > nameB) {
          return that.name_first_sort_ascend ? 1 : -1
        }
        return 0;
      });

      return {users: state.users};
    }, () => {
      this.name_first_sort_ascend = !this.name_first_sort_ascend;
    });
  }


  onClick_sort_email = () => {
    var that = this;
    this.setState((state)=> {
      state.users.sort(function(a, b) {
        var emailA = a.email.toLowerCase(),
            emailB = b.email.toLowerCase();
        if (emailA < emailB) {
          return that.email_sort_asecend ? -1 : 1
        } 
        if (emailA > emailB) {
          return that.email_sort_asecend ? 1 : -1
        }
        return 0;
      });

      return {users: state.users};
    }, () => {
      this.email_sort_asecend = !this.email_sort_asecend;
    });
  }

  onClick_search = (e) => {
    e.preventDefault();
    var search_type = $("#search-type-select").val(),
        search_value = String($("#search-input").val()).toLowerCase();
    if (search_value.length == 0) {
      this.setState({
        users: [...this.state.data],
      });
    } else {
      var data = this.state.data,
        users = [],
        property;
      for (var i=0; i<data.length; i++) {
        if (search_type == "first_name") {
          property = data[i].name_first;
        } else if (search_type == "last_name") {
          property = data[i].name_last;
        } else if (search_type == "email") {
          property = data[i].email;
        } else if (search_type == "phone") {
          property = data[i].phone;
        } else {
          return;
        }

        if (typeof property !== "string") {
          property = String(property);
        }

        if (property.toLowerCase().includes(search_value)) {
          users.push(data[i]);
        }
      }
      this.setState({
        users: users,
      });
    }
  }

  onClick_create_csv = () => {
    var filename = window.prompt("File name (Leave out .csv)?");
    if (filename.length == 0) {
      alert("Blank filename given");
      return;
    }
    let header = ["id", "first_name", "last_name","name_title", "email", "phone"];
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += header.join(",") + "\n";

    csvContent += this.state.users.map( u => {
      return `${u.people_id},${u.name_first},${u.name_last},${u.name_title},${u.email},${u.phone},`;
    }).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("target", "_blank");
    link.setAttribute('download', filename + ".csv");
    document.getElementById("download-container").appendChild(link);
    link.click();
    document.getElementById("download-container").remove(link);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onClick_search}>
          <button onClick={this.onClick_create_csv}>Create CSV</button>
          <button onClick={this.onClick_sort_first_name}>Sort by First Name</button>
          <button onClick={this.onClick_sort_email}>Sort by Email</button>
          <input type="tex" id="search-input"></input>
          <select id="search-type-select">
            <option value="first_name">First Name</option>
            <option value="last_name">Last Name</option>
            <option value="email">email</option>
            <option value="phone">phone</option>
          </select>
          <button type="submit" onClick={this.onClick_search}>Search</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>options</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((user, index) => {
              return (
              <tr>
                <td>{user.name_title + " " + user.name_first + " " + user.name_last }</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>
                  <button people_id={user.people_id} index={index}
                    onClick={this.onClick_phone}>edit phone</button>
                  <button people_id={user.people_id} index={index}
                    onClick={this.onClick_email}>edit email</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
        <div id="download-container"></div>
    </div>);  
  }
}

ReactDOM.render(<UsersTable />, document.getElementById("usersContainer"));