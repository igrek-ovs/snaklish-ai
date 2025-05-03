import { AuthenticationService, LocaleService } from '@core/services';
// import { LocaleService } from '@selfcare/cms';
import { Store } from '@ngrx/store';
// import { UserActions, userFeature } from '@state';
import { forkJoin, of } from 'rxjs';
import { filter, take } from 'rxjs/operators';

export function initializeApp(
  localeService: LocaleService,
  store: Store,
  authService: AuthenticationService
) {
  if (authService.isAuthorized()) {
    // store.dispatch(UserActions.getUserDetails());
  }
  const user$ = of(true);
  // authService.isAuthorized()
  //   ? store.select(userFeature.selectCurrent).pipe(
  //       filter((user) => !!user),
  //       take(1)
  //     )
  //   : of(true);

  return () => forkJoin([localeService.initializeLocalization(), user$]);
}