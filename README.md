# Three Character Selection

![Character Selection Demo](public/demo.gif)

I wanted to try something else, but I liked how the project looked at the time, so I thought I might as well kept it around with Git – and by extension, use GitHub for convenience.

Anyway, this is a mockup made with React that allows users to browse through a gallery of characters and select three of them. It provides a straightforward way to showcase and choose characters from a given list. This selection screen should work with any other set of characters, as long as the data format in `characters.json` and the naming convention for the images in the `public` folder are adhered.

```
{
    "charID": "reimu",
    "name": "Hakurei Reimu",
    "title": "Shrine Maiden of Paradise"
}
```

Keep the charID in mind when naming the images that you will put into these two folders. For instance with Reimu here, hers are named `reimu.webp`.

### `public`

- `portraits`
- `profiles`

This project is not responsive. I haven't figured that one out, so I hope your screen size is 1920×1080. If you happen to have a bigger monitor than mine, you can try `Ctrl + Shift + M` on your browser when running the project and set the screen size to 1920×1080 – but you shouldn't be that desperate to see my little ole' sandbox here in action.

Alright. The reason why I brought up responsiveness is that I can guarantee the layout of this project only when the images are at the couple of sizes I have specified – except the background image. I suppose `landscape.jpg` can be anything as long as it fits. The `portraits` folder expects an image size of 600×600, and the `profiles` folder expects an image size of 200×200. And don't take out the `blank.webp` in the `portraits` folder. That is needed for the initial state when the last two characters haven't been selected.

# Acknowledgments

- React and Vite for providing the framework to build this project.
- These Touhou standing portraits I use are made by [kaoru](https://www.pixiv.net/en/users/743845), which can be downloaded [over here](https://gensoukyou.1000.tv/dl.html) (_I hope you can/know how to make your way around Japanese_).
- The background video I'm using is from [ArtSqb](https://pixabay.com/videos/background-abstract-waves-slow-8788/).
- A ludicrous amount of queries to ChatGPT.
