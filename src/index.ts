import axios from 'axios'
import fs from 'fs'

const TIMEOUT = 60000
const REQUEST_PATH = 'https://api.audioaddict.com/v1/di/currently_playing'

interface IResponseChannel {
  channel_id: number
  channel_key: string
  track: {
    display_artist: string
    display_title: string
    duration: number
    id: number
    start_time: string
  }
}

interface ITrack {
  artist: string
  id: number
  title: string
}

interface IChannel {
  name: string
  id: number
  tracks: {
    [key: number]: ITrack
  }
}

interface IMusic {
  [key: number]: IChannel
}

let music: IMusic = {}

const loadCurrentlyPlaying = async (): Promise<void> => {
  await axios.get(REQUEST_PATH).then(async (response) => {
    const currentlyPlaying = response.data

    currentlyPlaying.forEach((channel: IResponseChannel) => {
      const { channel_key: channelKey, track } = channel
      const { display_artist: artist, display_title: title, id } = track

      if (!music[channelKey]) {
        music[channelKey] = {}
      }

      if (!music[channelKey][id]) {
        music[channelKey][id] = {
          artist,
          id,
          title
        }
      }
    })

    await save()
  })
}

const load = async (): Promise<void> => {
  try {
    const data = await fs.promises.readFile('./data/music.json', 'utf8')
    music = JSON.parse(data)
  } catch (error: any) {
    if (error?.code !== 'ENOENT' && error?.code !== 'EEXIST') {
      throw error
    }
  }
}

const save = async (): Promise<void> => {
  try {
    await fs.promises.mkdir('./data')
  } catch (error: any) {
    if (error?.code !== 'ENOENT' && error?.code !== 'EEXIST') {
      throw error
    }
  }

  try {
    await fs.promises.writeFile('./data/music.json', JSON.stringify(music, null, 2))
  } catch (error: any) {
    if (error?.code !== 'ENOENT' && error?.code !== 'EEXIST') {
      throw error
    }
  }

  console.log('saved')
}

const start = async (): Promise<void> => {
  await load()

  await loadCurrentlyPlaying()
  setInterval(() => {
    void loadCurrentlyPlaying()
  }, TIMEOUT)
}

void start()
