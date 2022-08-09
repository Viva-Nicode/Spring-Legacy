import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;

/* @WebListener */
public class SessionListenerEx implements HttpSessionAttributeListener {
  private static List<HttpSession> l = new ArrayList<>();

  public static List<HttpSession> getSessionList() { return l; }

  @Override
  public void attributeAdded(HttpSessionBindingEvent se) {
    System.out.println("getname() : " + se.getName());
    if (se.getName().equals("age")) {
      System.out.println("predicate statament is true");
      l.add(se.getSession());
    }
  }

  @Override
  public void attributeRemoved(HttpSessionBindingEvent se) {}

  @Override
  public void attributeReplaced(HttpSessionBindingEvent se) {}
}
// 지금 하는 기능을 구현하려면 세션이 만들어지는 시점에 발생하는 이벤트리스너가
// 아닌 세션에 어떤 속성이 바인딩되는 시점에 발생하는 이벤트 리스너를
// 구현해야한다. 어떤 세션을 만들고 그다음 세션에 id와 이름과 나이를 바인딩한다.
// 가장 마지막에 바인딩된 속성 이름이 age라면 id와 이름과 나이가 이미 전부
// 바인딩되어 있다는 뜻이다. 고로 바인딩된 세션을 가져와서 이름과 세션 자체를
// 해쉬맵에 저장해주면 된다. 현재 코드에서 이벤트가 발생한 세션의 name속성의
// 값이 null인 이유는 이벤트리스너가 아직 속성들이 바인딩 되지않은 세션을
// 얻어왔기 때문인 것으로 추측된다.