import { useEffect, useState } from 'react';
import { DefaultValue, RecoilValue, useRecoilValueLoadable } from 'recoil';

/**
 * useLoadable loads the given recoil value, but persists the "old value" during load
 * https://github.com/facebookexperimental/Recoil/issues/290
 *
 * @param initialValue initial value
 * @param recoilLoadable loadable
 */
export function useLoadable<T>(initialValue: T, recoilLoadable: RecoilValue<T>): [T, 'loading' | 'hasValue' | 'hasError']
{
  const [value, setValue] = useState(initialValue);
  const recoilValue = useRecoilValueLoadable<T>(recoilLoadable);

  let returnValue: T = initialValue;

  useEffect(() =>
  {
    if (recoilValue.state === 'hasValue' && recoilValue.contents !== value)
      setValue(recoilValue.contents);
  }, [recoilValue.contents, recoilValue.state, value]);

  if (recoilValue.state !== 'hasValue' && value)
    returnValue = value;

  if (recoilValue.state === 'hasValue')
    returnValue = recoilValue.contents;

  return [returnValue, recoilValue.state];
}

/**
 * Persist atom value in local storage via effect
 *
 * @param key key in local storage
 */
export function localStorageEffect(key: string)
{
  return ({ onSet, setSelf }: { onSet: any, setSelf: any }) =>
  {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null)
      setSelf(new Promise((resolve) => resolve(JSON.parse(savedValue))));

    onSet((newValue: any) =>
    {
      if (newValue instanceof DefaultValue)
        localStorage.removeItem(key);
      else
        localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
}