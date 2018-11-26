import React, { Component, Fragment} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Input, Container} from "semantic-ui-react";
import PhotoTileContainer from "./Components/PhotoTileContainer";
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import FlickrApi from "./api/flickr";

const PAGE_LIMIT = 200;
const TOAST_TIME_LIMIT = 2000;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      data: [],
      hasMore: false,
      loading: false,
      currentPage: 1
    }
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  removeDuplicates(toFilter = [], check = []) {
    if (!check.length) return toFilter;
    return toFilter.filter(item => check.find(cItem => cItem.id === item.id) === undefined)
  }

  displayError(message) {
    toast({
      type: 'error',
      title: 'Whoops',
      description: message,
      time: TOAST_TIME_LIMIT
    });
  }

  async doSearch() {
    // This is needed to stop an issue where the infinite scroll triggers itself
    this.setState({loading: true, hasMore: false});
    const tags = this.state.value.split(" ");
    const currentPage = this.state.currentPage;
    let photos = [];
    try {
      photos = await FlickrApi.search(tags, currentPage)
    } catch (error) {
      this.displayError("Something went wrong when trying to load more photos, please try again later!")
    }
    const currentData = this.state.data;
    const updatedData = this.removeDuplicates(photos, currentData);
    const nextPage = currentPage + 1;

    // Flickr API is a bit weird in that its paging allows you page forever by repeating
    // the first set of items again. It also sometimes sends the same photo again.
    // By deduplicating the items we know if we've reached the "end" cause it will have no items
    // also set a hard stop at 200 because there is usually approx 4000 items
    // https://www.flickr.com/groups/51035612836@N01/discuss/72157663968579450/

    if (!updatedData.length || nextPage > PAGE_LIMIT) {
      this.setState({
        hasMore: false,
        loading: false
      });
      return;
    }
    this.setState({
      data: currentData.concat(updatedData),
      hasMore: true,
      loading: false,
      currentPage: nextPage
    });
  }

  handleChange({target}) {
    this.setState({value: target.value});
  }

  handleKeyUp({keyCode}) {
    if (keyCode === 13) {
      if (!this.state.value.length) {
        this.displayError("You'll have to input something before you can search!")
        return;
      };
      // if they are doing a fresh search, default back to original
      this.setState({
        data: [],
        hasMore: false,
        currentPage: 1
      },  this.doSearch)
    }
  }

  render() {
    const loading = this.state.loading;
    return (
      <Fragment>
        <SemanticToastContainer />;
        <Container>
          <Input
            fluid
            loading={loading}
            icon="tags"
            iconPosition="left"
            placeholder="Enter Tags"
            value={this.state.value}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
          />
          {
            this.state.data.length ?
            <PhotoTileContainer
              data={this.state.data}
              onSearch={this.doSearch}
              hasMore={this.state.hasMore}
            /> : ""
          }
        </Container>
      </Fragment>
    );
  }
}

export default App;
