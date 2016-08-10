import { initUser } from '../actions/user';

export default class AccessControl {
  constructor(store) {
    this.store = store;
  }

  except = role => {
    return this.checkAccess(role, (replace, callback) => {
      const { user } = this.store.getState();

      if (!user.get('isLoading')) {
        if (role === user.get('role')) {
          replace(role !== 'GUEST' ? '/' : '/sign-in');
          typeof this.unsubscribe === 'function' && this.unsubscribe();
        }

        callback();
      }
    });
  };

  require = role => {
    return this.checkAccess(role, (replace, callback) => {
      const { user } = this.store.getState();

      if (!user.get('isLoading')) {
        if (role !== user.get('role')) {
          replace(role === 'GUEST' ? '/' : '/sign-in');
          typeof this.unsubscribe === 'function' && this.unsubscribe();
        }

        callback();
      }
    });
  };

  checkAccess(role, rule) {
    return (nextState, replace, callback) => {
      const { user } = this.store.getState();
      const accessToken = localStorage.getItem('accessToken');

      if (!user.get('isLoading')) {
        if (accessToken && !user.get('id')) {
          this.store.dispatch(initUser(accessToken));
        } else {
          rule(replace, callback);
        }

        typeof this.unsubscribe === 'function' && this.unsubscribe();
        this.unsubscribe = this.store.subscribe(rule.bind(this, replace, callback));
      }
    }
  }
}
