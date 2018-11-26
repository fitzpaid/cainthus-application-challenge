import React from 'react';
import {Loader} from "semantic-ui-react";
import InfiniteScroll from 'react-infinite-scroller';
import PhotoTile from "../PhotoTile";

export default ({data, onSearch, hasMore}) => (
    <InfiniteScroll
      className="ui four cards stackable spacing"
      loadMore={onSearch}
      hasMore={hasMore}
      initialLoad={false}
      threshold={700}
      loader={<Loader key={0} active inline='centered' />}
    >
      {
        data.map(({id, thumbnail, title, date, owner, tags, url}) => (
          <PhotoTile
            key={id}
            image={thumbnail}
            title={title}
            date={date}
            owner={owner}
            tags={tags}
            url={url}
          />
        ))
      }
    </InfiniteScroll>
)