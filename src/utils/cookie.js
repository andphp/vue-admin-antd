import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/constants'

export function GetToken() {
  return Vue.$cookies.get(ACCESS_TOKEN)
}

export function SetToken(token, sysTokenExp = 60 * 1000) {
  return Vue.$cookies.set(ACCESS_TOKEN, token, sysTokenExp)
}

export function RemoveToken() {
  return Vue.$cookies.remove(ACCESS_TOKEN)
}
