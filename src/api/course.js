import request from '@/utils/request.js'

// 四六级成绩查询
export const getCourseList = (username, ticketNumber) => { return request({ url: ' /cet/find?username=' + username + '&ticketNumber=' + ticketNumber , method: 'get'  }) }
