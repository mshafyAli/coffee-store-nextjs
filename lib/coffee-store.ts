import { MapboxType } from "@/types";


const getListOfCoffeeStorePhotos = async () => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query="coffee shop"&page=1&perPage=10&orientation=landscape`
    );
    const photos = await response.json();
    const results = photos?.results || [];
    return results?.map((result: { urls: any }) => result.urls['small']);
  } catch (error) {
    console.error('Error retrieving a photo', error);
  }
};

const transformCoffeData = (
  idx: number,
  result: MapboxType,
  photos: Array<string>
) => {
  return {
    id: result.id,
    address: result.properties?.address || '',
    name: result.text,
    imgUrl: photos.length > 0 ? photos[idx] : '',
  };
};


export const fetchCoffeeStores = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/coffee.json?limit=6&proximity=-79.3789680885594%2C43.653833032607096&access_token=${process.env.MAPBOX_API}`
      );
   
      const data = await response.json();
      const photos = await getListOfCoffeeStorePhotos();


      return data.features.map((result:MapboxType,idx:number)=>
        transformCoffeData(idx,result,photos)
      );
    } catch (error) {
      console.error('Error while fetching coffee stores', error);
    }
  };


  export const fetchCoffeeStore = async (id: string, queryId:string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${id}.json?proximity=ip&access_token=${process.env.MAPBOX_API}`
      );
      const data = await response.json();
      const photos = await getListOfCoffeeStorePhotos();

  
      const coffeeStore = data.features.map((result: MapboxType, idx: number) =>
        transformCoffeData (parseInt(queryId), result, photos)
      );
  
      return coffeeStore.length > 0 ? coffeeStore[0] : {};
    } catch (error) {
      console.error('Error while fetching coffee stores', error);
    }
  };