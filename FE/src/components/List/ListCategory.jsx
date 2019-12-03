import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Icon from "@material-ui/core/Icon";
import './listStyle.css';
import { Table, Input, Button, Popconfirm, Form } from 'antd';

import {
    getListCategoryAction,
  } from './../../redux/actions/AdminData';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };


  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Code',
        dataIndex: 'maLoaiSP',
        width: '30%',
        
      },
      {
        title: 'Name',
        dataIndex: 'tenLoai',
        editable: true,
        className:"ant-table-row-cell-break-word",
      },
      {
        title: 'Icon',
        dataIndex: 'icon',
        editable: true,
        className:"ant-table-row-cell-break-word",
        render(dataIndex) {
            return (
                <Icon
                className={dataIndex}
                style={{ fontSize: 22, width: 30, marginRight: 10 }}
              />
            )
          }
      },
      {
        title: 'Action',
        dataIndex: 'operation',
        
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <span>Delete</span>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      dataSource: [],
      count: 0,
    };

  }
  componentDidMount(){
      this.props.getListCategoryAD();
      this.setState({
          dataSource: this.props.listDataAD,
          count: this.props.listDataAD.length,

      })
  }
  static getDerivedStateFromProps(nextProps, prevState){
    return{
        ...prevState, dataSource: nextProps.listDataAD
    }
}

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    console.log("123");
    
    const { count, dataSource } = this.state;
    const newData = {
      maLoaiSP: "maLoai",
      tenLoai: "tenLoai",
      icon: "icon",
    };
    console.log(this.state.dataSource);
    
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
        <div style={{ padding: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="online-shop-title"> CATEGOIES </div>
        </div>

      <div>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add new
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          style={{ backgroundColor: "white" }} 
        />
      </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
    return {
      listDataAD: state.rootReducerAD.listDataAD,
    }
  };
  const mapDispatchToProps = (dispatch) => {
    return {
      getListCategoryAD: () => {
        dispatch(getListCategoryAction())
      },
  
    }
  };
  const ListCategory = EditableTable
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListCategory))