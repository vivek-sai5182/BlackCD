// AIzaSyBNAwp-KNn5aKgxyAPNvIoBjGbQqfdbDFU    -api key




export async function searchYT(query , maxRes =5){
    const API_KEY = "AIzaSyBNAwp-KNn5aKgxyAPNvIoBjGbQqfdbDFU";

    const url =`https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&type=video&maxResults=${maxRes}` +
    `&q=${encodeURIComponent(query)}` +
    `&key=${API_KEY}`;

    const res = await fetch(url)
    const data =await res.json();

    if(data.error){
        throw new Error(data.error.message)
    }


    return data.items.map(item =>({
        title : item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        videoId:item.id.videoId
    }))
}

// const s = await searchYT("stronger kanye",2)
// console.log(s)