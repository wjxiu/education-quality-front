const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  id:state => state.user.id,
  type:state =>state.user.type,
  roles:state=>state.user.roles,
}
export default getters
