#crawling
from icrawler.builtin import GoogleImageCrawler
#저장위치, 파일명
google_Crawler = GoogleImageCrawler(storage={'root_dir': r'캐주얼12'})
#키워드, 다운로드 상한선
google_Crawler.crawl(keyword = '남자 캐주얼 상의 사진', max_num = 800)