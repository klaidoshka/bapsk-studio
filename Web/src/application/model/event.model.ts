export default interface Event<D> {
  id: string;
  data: D;
}

export const events = {
  loggedOut: {
    id: 'logged-out',
    data: undefined
  }
};
