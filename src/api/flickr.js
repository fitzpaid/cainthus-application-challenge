const API_KEY = "";

const search = async (searchTerms = [], page = 1) => {
  if (searchTerms.length <= 0) throw new Error("Please Provide A Search Param");
  const tags = searchTerms.join("+");
  const searchURL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&tags=${tags}&extras=date_taken%2C+owner_name%2C+tags%2C+url_m&per_page=20&page=${page}&sort=date-taken-desc&format=json&nojsoncallback=1`
  const result = await fetch(searchURL)
  const data = await result.json();
  return data.photos.photo.map(photo => {
    return {
      id: photo.id,
      thumbnail: photo.url_m,
      title: photo.title,
      date: photo.datetaken,
      owner: photo.ownername,
      tags: photo.tags,
      url: `https://www.flickr.com/photos/${photo.owner}/${photo.id}`
    }
  });
}

export default {
  search
}