import React, { Component } from "react";
import Item from "../Item/Item";
import "./ProductList.css";
import queryString from "query-string";

import Api from "../../Api";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import PriceDialog from "../Dialog/PriceDialog";
import Paging from "../Paging/Paging";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import HeaderContent from "../Header/HeaderContent";
import BackToTop from "../ProtectedRoute/BackToTop";

const sortOptions = [
  <MenuItem key={"lh"} value={"lh"}>
    Sort by price: Low to High
  </MenuItem>,
  <MenuItem key={"hl"} value={"hl"}>
    Sort by price: High to Low
  </MenuItem>
];
 
// This component retrieves the products it needs to show.
// It determines the kind of products it needs to show from query string.
// It checks the query string on first render and on every props change.
class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unfinishedTasks: 0,
      openPriceDialog: false,
      wholeDataLength: null,
      items: []
    };

    this.getParamFromQS = this.getParamFromQS.bind(this);
    this.updateURLAndRedirect = this.updateURLAndRedirect.bind(this);
    // Api.getDataProductAction();
  }
  componentWillMount(){
    // Api.getDataProductAction();
    Api.getListProductAction(); //api get data list product
  }
  
  // Convert object to query string
  objectToQueryString(params) {
    var esc = encodeURIComponent;
    var query = Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k] !== undefined ? params[k] : ""))
      .join("&");
    console.log("query",query);
    
    return query;
  }

  // This function is used to update the query string with new values
  // and redirect to new URL.
  updateURLAndRedirect(newValues, restartPaging) {
    // console.log("curentQS: " , this.props.location.search); 
    
    let currentQs = queryString.parse(this.props.location.search);
    let newQS = { ...currentQs, ...newValues };
   
    
    if (restartPaging) {
      console.log("before restart:" , currentQs);
      
      delete newQS["page"];
      console.log("after restart:" , currentQs);
    }

    this.props.history.push("/search/?" + this.objectToQueryString(newQS));
  }

  // Extract value of certain parameter from query string.
  getParamFromQS(name, props = this.props) {
    let qs = queryString.parse(props.location.search);

    switch (name) {
      case "category":
        return qs.category || "popular";
      case "term":
        return qs.term || "";
      case "page":
        return qs.page || "1";
      case "minPrice":
        return qs.minPrice || "10";
      case "maxPrice":
        return qs.maxPrice || "10000";
      case "usePriceFilter":
        return qs.usePriceFilter === "true";
      case "sortValue":
        return qs.sortValue || "lh";
      case "itemsPerPage":
        return qs.itemsPerPage || "15";
      case "directCategoryClick":
        return qs.term === undefined;
      default:
        return undefined;
    }
  }


  async fetchData(props = this.props) {
    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));

    // Make simulated request to server to get items
    let results = await Api.searchItems({
      category: this.getParamFromQS("category", props),
      term: this.getParamFromQS("term", props),
      page: this.getParamFromQS("page", props),
      itemsPerPage: this.getParamFromQS("itemsPerPage", props),
      minPrice: this.getParamFromQS("minPrice", props),
      maxPrice: this.getParamFromQS("maxPrice", props),
      sortValue: this.getParamFromQS("sortValue", props),
      usePriceFilter: this.getParamFromQS("usePriceFilter", props)
    });

    this.setState(ps => ({
      items: results.data,
      unfinishedTasks: ps.unfinishedTasks - 1,
      wholeDataLength: results.totalLength
    }));
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }

  handleSortChange = e => {
    this.updateURLAndRedirect({ sortValue: e.value });
  };

  getPageTitle() {
    let pageTitle;
    if (this.getParamFromQS("category") === "popular") {
      pageTitle = "New products";
    } else if (this.getParamFromQS("directCategoryClick")) {
      pageTitle = this.getParamFromQS("category");
      if(pageTitle==="LSP01"){
        pageTitle="Computers"
      }
      else if(pageTitle==="LSP02"){
        pageTitle="Phones"
      }
      else if(pageTitle==="LSP03"){
        pageTitle="Watches"
      }
      else if(pageTitle==="LSP04"){
        pageTitle="Accessory"
      }
      else if(pageTitle==="LSP05"){
        pageTitle="Camera"
      }
    } else {
      pageTitle = "Search results";
    }
    return pageTitle;
  }

  render() {
    return (
      <div className="product-list">
        <HeaderContent history={this.props.history} item={this.getPageTitle()}/>
        <div className="product-list-header">
          
          <div className="product-list-title" style={{ flexGrow: 1 }}>
            {this.getPageTitle()}
          </div>
          <div className="prodict-list-filter">
            <FormControlLabel
              style={{ marginBottom: 5 }}
              control={
                <Checkbox
                  color="primary"
                  checked={this.getParamFromQS("usePriceFilter")}
                  onChange={e => {
                    this.updateURLAndRedirect(
                      { usePriceFilter: e.target.checked },
                      true
                    );
                  }}
                />
              }
              label="Filter by price"
            />
            {this.getParamFromQS("usePriceFilter") && (
              <Tooltip title="Click to change range" >
                <Button
                  variant="outlined"
                  style={{ marginRight: 20 }}
                  onClick={() => {
                    this.setState({
                      openPriceDialog: true
                    });
                  }}
                >
                  {this.getParamFromQS("minPrice") +
                    "$ - " +
                    this.getParamFromQS("maxPrice") +
                    "$"}
                </Button>
              </Tooltip>
            )}
            <Select
              style={{ maxWidth: 400, marginBottom: 10 }}
              value={this.getParamFromQS("sortValue")}
              MenuProps={{
                style: {
                  maxHeight: 500
                }
              }}
              onChange={e => {
                this.updateURLAndRedirect({ sortValue: e.target.value });
              }}
            >
              {sortOptions}
            </Select>
          </div>
        </div>
        
        <div >
          {this.state.unfinishedTasks !== 0 ? (
            <CircularProgress className="circular " />
          ) : (
            <div>
              
              <div style={{ display: "flex" , flexWrap:"wrap" }}>
                  {
                    this.state.items.map(item => {
                      return <Item key={item.maSP} item={item}   /*reducesoLuongTon={this.reducesoLuongTon}*/ />;
                    })
                  }
              </div>
            </div>
            
          )}
        </div>
        {this.state.unfinishedTasks === 0 && (
          <Paging
            getParamFromQS={this.getParamFromQS}
            updateURLAndRedirect={this.updateURLAndRedirect}
            wholeDataLength={this.state.wholeDataLength}
          />
        )}
        <PriceDialog
          open={this.state.openPriceDialog}
          min={this.getParamFromQS("minPrice")}
          max={this.getParamFromQS("maxPrice")}
          onSave={(min, max) => {
            this.setState({ openPriceDialog: false });
            this.updateURLAndRedirect({ minPrice: min, maxPrice: max }, true);
          }}
          onClose={() =>
            this.setState({
              openPriceDialog: false
            })
          }
        />
        <BackToTop/>
      </div>
    );
  }
}

export default ProductList;
