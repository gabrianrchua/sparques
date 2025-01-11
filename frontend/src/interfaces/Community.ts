interface Image {
  mime: string,
  data: string,
}

export default interface Community {
  title: string,
  bannerImage: Image | undefined,
  iconImage: Image | undefined,
}